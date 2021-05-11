resource "aws_lambda_function" "migration_lambda" {
  filename      = "${path.module}/output/lambda.zip"
  function_name = "reflect-migration"
  handler       = "index.handler"
  role          = aws_iam_role.migration_role.arn
  layers        = [aws_lambda_layer_version.migration_lambda_layer.arn]
  runtime       = "nodejs12.x"
  timeout       = 60
  source_code_hash = filebase64sha256("output/lambda.zip")
}

data "archive_file" "package" {
  type        = "zip"
  output_path = "${path.module}/output/lambda.zip"
  source_dir  = "${path.module}/dist/lambda"
}

resource "aws_lambda_layer_version" "migration_lambda_layer" {
  filename            = "${path.module}/output/layer.zip"
  layer_name          = "MigrationLambdaLayer"
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash = filebase64sha256("output/layer.zip")
}

data "archive_file" "layer_package" {
  type        = "zip"
  output_path = "${path.module}/output/layer.zip"
  source_dir  = "${path.module}/dist/layer"
}

data "aws_iam_policy_document" "migration_policy_document" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "migration_role" {
  name               = "migration_role"
  path               = "/system/"
  assume_role_policy = data.aws_iam_policy_document.migration_policy_document.json
}

data "aws_iam_policy_document" "migration_logging_policy_document" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "migration_logging" {
  name   = "MigrationLogging"
  role   = aws_iam_role.migration_role.name
  policy = data.aws_iam_policy_document.migration_logging_policy_document.json
}

data "aws_iam_policy_document" "migration_dynamodb_policy_document" {
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
    resources = [local.reflect_table_arn, "${local.reflect_table_arn}/*"]
  }
}

resource "aws_iam_role_policy" "migration_lambda_dynamodb_policy" {
  name   = "MigrationDynamoDB"
  role   = aws_iam_role.migration_role.name
  policy = data.aws_iam_policy_document.migration_dynamodb_policy_document.json
}
