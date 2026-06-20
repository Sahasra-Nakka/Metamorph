terraform {
  backend "azurerm" {
    resource_group_name  = "metamorph"
    storage_account_name = "metamorphtfstate"
    container_name        = "tfstate"
    key                    = "prod.terraform.tfstate"
  }
}