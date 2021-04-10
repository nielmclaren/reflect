provider "aws" {
  region  = "us-west-2"
  version = "~>3.0.0"
}

resource aws_dynamodb_table reflect_table {
  name         = "ReflectTable"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"

  attribute {
    name = "PK"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

output reflect_table {
  value = {
    arn = aws_dynamodb_table.reflect_table.arn
  }
}
