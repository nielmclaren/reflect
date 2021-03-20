provider "aws" {
  region  = "us-west-2"
  version = "~>3.0.0"
}

resource "aws_s3_bucket" "reflect_nielmclaren_com" {
  bucket = "reflect.nielmclaren.com"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}
