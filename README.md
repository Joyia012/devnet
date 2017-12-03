# dagcoin-devnet
Dagcoin network from scratch for development purposes


## Using with docker

Building the devnet docker image:

```
$ docker build -t devnet:latest .
```

Running the devnet:

```
$ docker run -it -p 6611:6611 -p 6612:6612 -p 8080:8080 devnet
```