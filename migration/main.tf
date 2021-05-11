provider "aws" {
  region  = "us-west-2"
  version = "~>3.0.0"
}

data "terraform_remote_state" "storage" {
  backend = "local"

  config = {
    path = "../storage/terraform.tfstate"
  }
}

locals {
  reflect_table_arn = data.terraform_remote_state.storage.outputs.reflect_table.arn
}