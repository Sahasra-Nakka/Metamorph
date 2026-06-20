variable "location" {
  description = "Azure region for all prod resources"
  type        = string
  default     = "southindia"
}

variable "project_name" {
  description = "Base name used to prefix all resources"
  type        = string
  default     = "metamorph"
}