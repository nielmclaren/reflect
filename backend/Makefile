clean:
	rm -rf dist

build: clean
	yarn build

init:
	aws-vault exec nielmclaren -- terraform init

apply:
	aws-vault exec nielmclaren -- terraform apply