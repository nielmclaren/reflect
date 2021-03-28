resource "aws_cognito_identity_pool" "users" {
  identity_pool_name               = "Reflect Users"
  allow_unauthenticated_identities = false

  supported_login_providers = {
    "accounts.google.com" = "839537928694-64hkc594cngm20b9uognbae6dqlo1a3d.apps.googleusercontent.com"
  }
}

resource "aws_iam_role" "authenticated_role" {
  name               = "ReflectUsersAuthenticated"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.users.id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "authenticated_role_policy" {
  name   = "ReflectUsersAuthenticated"
  role   = aws_iam_role.authenticated_role.id
  policy = data.aws_iam_policy_document.authenticated_policy_document.json
}

data "aws_iam_policy_document" "authenticated_policy_document" {
  policy_id = "ReflectUsersAuthenticated"

  statement {
    sid = "AllowCognito"
    actions = [
      "cognito-sync:*",
      "cognito-identity:*",
    ]
    resources = ["*"]
  }

  statement {
    sid = "AllowExecuteAPIGateway"
    actions = [
      "execute-api:*"
    ]
    resources = ["${aws_api_gateway_rest_api.api.execution_arn}/*"]
  }
}

resource "aws_cognito_identity_pool_roles_attachment" "users_role_attachment" {
  identity_pool_id = aws_cognito_identity_pool.users.id
  roles = {
    "authenticated" = aws_iam_role.authenticated_role.arn
  }
}
