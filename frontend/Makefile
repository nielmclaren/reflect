start:
	yarn start

build:
	yarn build

apply: build
	aws-vault exec nielmclaren -- aws s3 sync ./build s3://nielmclaren-reflect/ --sse --cache-control 'max-age=604800' --delete

test:
	yarn test