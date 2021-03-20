resource "aws_api_gateway_rest_api" "api" {
  name = "reflect-api"
}

resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "api"
}

resource "aws_api_gateway_resource" "version_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "v1"
}

resource "aws_api_gateway_resource" "entries_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.version_resource.id
  path_part   = "entries"
}

resource "aws_api_gateway_resource" "entry_id_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.entries_resource.id
  path_part   = "{entryId}"
}

resource "aws_api_gateway_method" "entry_id_get_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.entry_id_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_settings" "container_id_get_method_settings" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.api_dev_stage.stage_name
  method_path = "${aws_api_gateway_resource.entry_id_resource.path_part}/${aws_api_gateway_method.entry_id_get_method.http_method}"

  settings {
    logging_level      = "INFO"
    data_trace_enabled = true
    metrics_enabled    = true
  }
}

resource "aws_api_gateway_integration" "entry_id_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.entry_id_resource.id
  http_method             = aws_api_gateway_method.entry_id_get_method.http_method
  integration_http_method = "POST" # Lambda integration method is always POST, even for GET
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_handler_lambda.invoke_arn
}

resource "aws_api_gateway_method" "entry_id_post_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.entry_id_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method_settings" "container_id_post_method_settings" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.api_dev_stage.stage_name
  method_path = "${aws_api_gateway_resource.entry_id_resource.path_part}/${aws_api_gateway_method.entry_id_post_method.http_method}"

  settings {
    logging_level      = "INFO"
    data_trace_enabled = true
    metrics_enabled    = true
  }
}

resource "aws_api_gateway_integration" "entry_id_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.entry_id_resource.id
  http_method             = aws_api_gateway_method.entry_id_post_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_handler_lambda.invoke_arn
}

resource "aws_api_gateway_stage" "api_dev_stage" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "dev"
  deployment_id = aws_api_gateway_deployment.api_deployment.id
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  # Terraform does not redeploy the API when changes are made to the REST resources so the
  # triggers block will force replacement of this resource "when" "this" file changes.
  triggers = {
    redeployment = md5(file("${path.module}/apigateway.tf"))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.entry_id_get_integration,
    aws_api_gateway_integration.entry_id_post_integration,
  ]
}

resource "aws_lambda_permission" "analytics_container_events_invoke_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_handler_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  depends_on    = [aws_api_gateway_rest_api.api]
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}
