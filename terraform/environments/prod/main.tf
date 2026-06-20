terraform {
  required_version = ">= 1.7.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.95"
    }
  }
}

provider "azurerm" {
  features {}
}

module "resource_group" {
  source = "../../modules/resource_group"

  name     = "${var.project_name}-prod-rg"
  location = var.location

  tags = {
    environment = "prod"
    project     = "metamorph"
    managed_by  = "terraform"
  }
}

module "acr" {
  source = "../../modules/acr"

  name                = "${var.project_name}acr"
  resource_group_name = module.resource_group.name
  location             = var.location

  tags = {
    environment = "prod"
    project     = "metamorph"
    managed_by  = "terraform"
  }
}

module "app_service_plan" {
  source = "../../modules/app_service_plan"

  name                = "${var.project_name}-prod-plan"
  resource_group_name = module.resource_group.name
  location             = var.location
  sku_name             = "B1"

  tags = {
    environment = "prod"
    project     = "metamorph"
    managed_by  = "terraform"
  }
}

module "backend_app" {
  source = "../../modules/linux_web_app"

  name                 = "${var.project_name}-backend"
  resource_group_name = module.resource_group.name
  location             = var.location
  service_plan_id      = module.app_service_plan.id

  acr_login_server = module.acr.login_server
  image_name        = "backend"
  image_tag          = "latest"
  app_port           = 8000

  app_settings = {
    FRONTEND_URL = "https://${var.project_name}-frontend.azurewebsites.net"
  }

  tags = {
    environment = "prod"
    project     = "metamorph"
    managed_by  = "terraform"
  }
}

module "frontend_app" {
  source = "../../modules/linux_web_app"

  name                 = "${var.project_name}-frontend"
  resource_group_name = module.resource_group.name
  location             = var.location
  service_plan_id      = module.app_service_plan.id

  acr_login_server = module.acr.login_server
  image_name        = "frontend"
  image_tag          = "latest"
  app_port           = 80

  app_settings = {}

  tags = {
    environment = "prod"
    project     = "metamorph"
    managed_by  = "terraform"
  }
}

resource "azurerm_role_assignment" "backend_acr_pull" {
  scope                = module.acr.id
  role_definition_name = "AcrPull"
  principal_id          = module.backend_app.principal_id
}

resource "azurerm_role_assignment" "frontend_acr_pull" {
  scope                = module.acr.id
  role_definition_name = "AcrPull"
  principal_id          = module.frontend_app.principal_id
}