## JAGS

You can test if the R package "rjags" is installed and working in your system by running a simple script in the R environment. Here's how:

* Load the R Jags coda and lattice modules: `module load r r-rjags r-coda r-lattice` 
* Start an R session.
* Run the following command: `library(rjags)`. If the package is installed and loaded correctly, you should not see any error messages.
* To check if JAGS is working correctly with R, you can run a simple JAGS model and sample from it. Here's a sample script that defines a simple Bayesian model in JAGS and samples from it:

```bash
library(rjags)

model_string = "
model {
  for (i in 1:100) {
    x[i] ~ dnorm(0, 1)
  }
  mu <- mean(x)
  sigma <- sd(x)
}
"

jags_model = jags.model(textConnection(model_string), data = list(), n.chains = 2)
update(jags_model, n.iter = 1000)

samples = coda.samples(jags_model, c("mu", "sigma"), n.iter = 1000)
summary(samples)
```

If the script runs successfully and provides output, it means that both R and JAGS are installed and working correctly.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=Xn2c7rgc3rM
" target="_blank"><img src="http://img.youtube.com/vi/Xn2c7rgc3rM/0.jpg" 
alt="Check if R JAGS is installed." width="240" height="180" border="10" /></a>
