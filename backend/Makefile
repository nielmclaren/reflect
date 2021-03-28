.PHONY: clean build init apply

clean:
	rm -rf dist

build: clean
	yarn build
	cp -R node_modules dist/ # TODO Don't include dev dependencies in lambda package.

init:
	aws-vault exec nielmclaren -- terraform init

apply:
	aws-vault exec nielmclaren -- terraform apply

destroy:
	aws-vault exec nielmclaren -- terraform destroy