# SimulatorEngineFrontend

This project is frontend part of Simulator Engine application created for Editing message payload in diffrent format (Currently only FIX connection type is supported) and replying to them including autmatic reply functionality.

## Running Development server

Run `ng serve` for a dev server for frontend. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Working wit FIX messages

Application is working properly only with up and runing simulator engine backend part and simulator spring gateway:

https://gbhv-euif-git01.euifunds.local/funds-dev/fix-simulator-gateway-engine
https://gbhv-euif-git01.euifunds.local/funds-dev/gateway-simulator

## Build application artifacts

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running with Docker

run command "npm run build --configuration=={YOUR_ENV}"

login to artifactory using "docker login artifactory.euifunds.local:58081"

run command "npm run docker:build"

run command "npm run docker:run"
