resource "aws_lambda_function" "api_handler_lambda" {
  filename      = "output/package.zip"
  function_name = "reflect-api-handler"
  handler       = "index.handler"
  role          = aws_iam_role.api_handler_role.arn
  runtime       = "nodejs12.x"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("output/package.zip")
}

data "archive_file" "package" {
  type        = "zip"
  output_path = "${path.module}/output/package.zip"
  source_dir  = "${path.module}/dist"
}

data "aws_iam_policy_document" "api_handler_policy_document" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "api_handler_role" {
  name               = "api_handler_role"
  path               = "/system/"
  assume_role_policy = data.aws_iam_policy_document.api_handler_policy_document.json
}

data "aws_iam_policy_document" "api_handler_logging_policy_document" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
}

resource aws_iam_role_policy api_handler_logging {
  name   = "ApiHandlerLogging"
  role   = aws_iam_role.api_handler_role.name
  policy = data.aws_iam_policy_document.api_handler_logging_policy_document.json
}

data "aws_iam_policy_document" "api_handler_dynamodb_policy_document" {
  statement {
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem"
    ]
    resources = ["${local.reflect_table_arn}", "${local.reflect_table_arn}/*"]
  }
}

resource aws_iam_role_policy analytics_disconnect_dynamodb_policy {
  name = "ApiHandlerDynamoDB"
  role   = aws_iam_role.api_handler_role.name
  policy = data.aws_iam_policy_document.api_handler_dynamodb_policy_document.json
}