# Container Block

The Container block enables you to group other blocks together inside a single wrapper section and is often used to contain, pad, and occasionally center the content within it. Generally, this block acts as a parent block that can hold multiple child blocks within it.

## Requirements

* WordPress version 5.7 or greater.
* PHP version 7.3 or greater.

## Development

You'll need [Node.js](https://nodejs.org/) and [Composer](https://getcomposer.org/) installed
on your computer in order to build this theme.

* Download or fork the repository.
* Run `npm install` to install NPM dependencies
* Run `npm run dev` command to compile and watch source files for changes while developing.
* Run `composer install` to install composer dependencies

## Production

* Download or fork the repository
* Run `npm install` to install NPM dependencies
* Run `npm run build` to compile assets for production
* Run `composer install --no-dev --optimize-autoloader` to install composer packages required in production
