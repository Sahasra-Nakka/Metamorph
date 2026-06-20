variable "name" {
  description = "Name of the container registry (must be globally unique, alphanumeric only, no dashes)"
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

variable "sku" {
  description = "ACR pricing tier"
  type        = string
  default     = "Basic"
}

variable "tags" {
  description = "Tags to apply"
  type        = map(string)
  default     = {}
}