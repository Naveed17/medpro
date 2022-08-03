project = "med-pro"

variable "registry_image" {
  type    = string
  env     = ["CI_REGISTRY_IMAGE"]
  default = "ghcr.io/smartmedsa/med-pro"
}

variable "registry_image_tag" {
  type    = string
  env     = ["IMAGE_TAG"]
  default = gitrefpretty()
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
  default   = "ghcr.io.smartmedsa.med-pro"
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
    zone   = string
  })
}

labels = {
  "app.med.tn/managed-by" = "Waypoint"
  "app.med.tn/part-of"    = "med-pro"
}

app "med-pro" {

  url {
    auto_hostname = false
  }

  config {
  }

  build {
    use "docker-pull" {
      image = "ghcr.io/smartmedsa/med-pro"
      tag   = "develop"

      auth {
        username = var.registry_auth_username
        password = var.registry_auth_password
      }
    }
    registry {
      use "docker" {
        image = var.registry_image
        tag   = var.registry_image_tag
        auth {
          username = var.registry_auth_username
          password = var.registry_auth_password
        }
      }
    }
  }

  deploy {
    use "kubernetes" {
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
          # this is important, sets correct CNAME to the Cloudflare Tunnel record
          "external-dns.alpha.kubernetes.io/target"             = var.ingress.target
          "external-dns.alpha.kubernetes.io/cloudflare-proxied" = true
        }

        path_type = "Prefix"
        path      = "/"
        host      = "med-pro-${workspace.name}.${var.ingress.zone}"
      }
    }
  }
}
