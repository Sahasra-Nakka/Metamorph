variable "name" {
  description = "Name of the App Service Plan"
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

variable "sku_name" {
  description = "Pricing tier (e.g. B1, B2, P1v2)"
  type        = string
  default     = "B1"
}

variable "tags" {
  description = "Tags to apply"
  type        = map(string)
  default     = {}
}