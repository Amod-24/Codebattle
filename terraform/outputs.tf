output "ecr_repository_url" {
  value = aws_ecr_repository.main.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.main.name
}

output "s3_bucket_name" {
  value = aws_s3_bucket.artifacts.id
}

output "alb_dns_name" {
  value       = aws_lb.main.dns_name
  description = "The public DNS name of the Application Load Balancer"
}
