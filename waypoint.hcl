project = "med-pro"

variable "registry_image" {
  type    = string
  env     = ["CI_REGISTRY_IMAGE"]
  default = "ghcr.io/smartmedsa/med-pro"
}

variable "registry_auth_username" {
  type = string
  env  = ["CI_REGISTRY_USER", "GITLAB_NAME", "GITHUB_ACTOR"]
}

variable "registry_auth_password" {
  type      = string
  env       = ["CI_REGISTRY_PASSWORD", "GITLAB_TOKEN", "GITHUB_TOKEN"]
  sensitive = true
}

variable "registry_secrets" {
  type      = string
  default   = "io.ghcr.smartmedsa"
  sensitive = true
}

variable "k8s_context" {
  type    = string
  default = "default"
}

variable "k8s_namespace" {
  type    = string
  default = "default"
}

variable "ingress" {
  description = "Ingress configuration to be used during deployment."
  type = object({
    class  = string
    target = string
    host   = string
  })
}

variable "env" {
  description = "Environment variables needed to build the application."
  type        = map(string)
  sensitive   = true
  default     = {}
}

labels = {
  "app.med.tn/managed-by" = "Waypoint"
  "app.med.tn/part-of"    = "med-pro"
}

app "med-pro" {
  url {
    auto_hostname = false
  }

  build {
    hook {
      when = "before"
      command = [
        "cp", "-v",
        templatefile("${path.app}/.env.local.dist", var.env),
        "${path.app}/.env"
      ]
    }

    hook {
      when       = "after"
      command    = ["rm", "${path.app}/.env"]
      on_failure = "continue"
    }

    use "docker" {
      auth {
        username = var.registry_auth_username
        password = var.registry_auth_password
      }
    }
    registry {
      use "docker" {
        image = var.registry_image
        tag   = gitrefpretty()

        auth {
          username = var.registry_auth_username
          password = var.registry_auth_password
        }
      }
    }
  }

  deploy {
    use "kubernetes" {
      context      = var.k8s_context
      namespace    = var.k8s_namespace
      image_secret = var.registry_secrets
      replicas     = 1
      probe_path   = "/"
      service_port = 3000
    }
  }

  release {
    use "kubernetes" {
      context       = var.k8s_context
      namespace     = var.k8s_namespace
      load_balancer = false

      ingress "http" {
        annotations = {
          # this is important, sets correct CNAME to the Cloudflare Tunnel
          # record.
          "external-dns.alpha.kubernetes.io/target"             = var.ingress.target
          "external-dns.alpha.kubernetes.io/cloudflare-proxied" = true
          ## Resolve HTTP 502 error using ingress-nginx:
          ## See https://www.ibm.com/support/pages/502-error-ingress-keycloak-response
          "nginx.ingress.kubernetes.io/proxy-buffer-size" = "128k"
          "ingress.kubernetes.io/force-ssl-redirect"= "true"
        }

        path_type = "Prefix"
        path      = "/"
        host      = var.ingress.host
      }
    }

    hook {
      when = "after"
      command = ["bash", "-c",
        <<-EOF
          mkdir -p ${path.project}/.wpoutputs/
          echo 'https://${var.ingress.host}' > ${path.project}/.wpoutputs/ingress_host
          EOF
      ]
    }
  }
}
