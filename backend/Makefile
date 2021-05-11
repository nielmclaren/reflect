.PHONY: clean build init apply

clean:
	rm -rf dist/lambda

build: clean
	yarn build

clean_layer:
	rm -rf dist/layer

build_layer: clean_layer
	mkdir -p dist/layer/nodejs # Lambda Layer requires nodejs subfolder
	yarn install --production --modules-folder dist/layer/nodejs/node_modules

init:
	aws-vault exec nielmclaren -- terraform init

apply:
	aws-vault exec nielmclaren -- terraform apply

destroy:
	aws-vault exec nielmclaren -- terraform destroy