variable "name" {
  description = "Name of the App Service (must be globally unique, becomes part of the URL)"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group to deploy into"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "service_plan_id" {
  description = "ID of the App Service Plan to run on"
  type        = string
}

variable "acr_login_server" {
  description = "ACR login server, e.g. metamorphacr.azurecr.io"
  type        = string
}

variable "image_name" {
  description = "Docker image name within the registry, e.g. backend"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "app_port" {
  description = "Port the container listens on internally"
  type        = number
}

variable "app_settings" {
  description = "Extra environment variables for the app"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Tags to apply"
  type        = map(string)
  default     = {}
}