
output "alb_url" {
  value = aws_lb.main.dns_name
}

output "ecr_url" {
  value = aws_ecr_repository.app.repository_url
}