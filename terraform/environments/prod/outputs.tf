output "acr_login_server" {
  value = module.acr.login_server
}

output "app_service_plan_id" {
  value = module.app_service_plan.id
}

output "backend_url" {
  value = "https://${module.backend_app.default_hostname}"
}

output "backend_principal_id" {
  value = module.backend_app.principal_id
}

output "frontend_url" {
  value = "https://${module.frontend_app.default_hostname}"
}

output "frontend_principal_id" {
  value = module.frontend_app.principal_id
}