data "aws_acm_certificate" "api_certificate" {
  domain   = "*.nielmclaren.com"
  statuses = ["ISSUED"]
}

resource "aws_api_gateway_domain_name" "api_domain_name" {
  domain_name              = "reflect-api.nielmclaren.com"
  regional_certificate_arn = data.aws_acm_certificate.api_certificate.arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_base_path_mapping" "api_mapping" {
  api_id      = aws_api_gateway_rest_api.api.id
  domain_name = aws_api_gateway_domain_name.api_domain_name.domain_name
  stage_name  = aws_api_gateway_stage.api_dev_stage.stage_name
}

data "aws_route53_zone" "nielmclaren_com" {
  name = "nielmclaren.com"
}

resource "aws_route53_zone" "reflect_api_nielmclaren_com" {
  name = "reflect-api.nielmclaren.com"
}

resource "aws_route53_record" "reflect_api_alias_record" {
  zone_id = data.aws_route53_zone.nielmclaren_com.zone_id
  name    = "reflect-api.nielmclaren.com"
  type    = "A"

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.api_domain_name.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_domain_name.regional_zone_id
  }
}
