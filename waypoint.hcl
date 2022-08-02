project = "med-pro-minikube"

labels = { "tech" = "Nextjs" }

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
  type = string
  default = "default"
}

variable "k8s_namespace" {
  type    = string
  default = "default"
}

labels = {
  "app.med.tn/managed-by" = "Waypoint"
  "app.med.tn/part-of"    = "med-pro"
}

app "med-pro-minikube" {

      url {
    auto_hostname = false
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
          username = var.auth_registry_username
          password = var.auth_registry_password
        }
      }
    }
  }

  deploy {
    use "kubernetes" {
      image_secret = var.auth_registry_password
      replicas     = 1
      probe_path   = "/"
      service_port = 3000
    }
  }
}