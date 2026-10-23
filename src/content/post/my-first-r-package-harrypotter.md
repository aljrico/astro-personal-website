---
title: "My First R Package: harrypotter"
publishDate: "29 November 2018"
description: "Introducing harrypotter, my first R package on CRAN: colour palettes from the Hogwarts houses, ready for base R and ggplot2."
tags: ["r", "programming", "data-visualization"]
---

<img src="/posts/harrypotter-logo.png" alt="harrypotter logo" style="width:50px" />


<a href="https://cran.r-project.org/package=harrypotter"><img src="https://www.r-pkg.org/badges/version/harrypotter" alt="cran version" style="display:inline;width:auto" /></a>
<a href="https://github.com/metacran/cranlogs.app"><img src="https://cranlogs.r-pkg.org/badges/harrypotter" alt="rstudio mirror per-month downloads" style="display:inline;width:auto" /></a>
<a href="https://github.com/metacran/cranlogs.app"><img src="https://cranlogs.r-pkg.org/badges/grand-total/harrypotter?color=yellowgreen" alt="rstudio mirror total downloads" style="display:inline;width:auto" /></a>


I want to present you my first **R** package, [already published](https://cran.r-project.org/package=harrypotter) in CRAN. 

I have to say that has been a challenging but very exciting experience. I've learned a lot of stuff and now I can appreciate that the way packages are structured, and the existence of the CRAN is one of the highlights of `R`, and one of its strongest advantages over other languages.

This package provides the first round of palettes derived from the *Harry Potter* film series.

At its first version, it simply contains the palettes of the [Hogwarts](https://en.wikipedia.org/wiki/Hogwarts) Houses. They have been chosen manually, taking into account its consistency with all the existing branding of the franchise, but its suitability for data visualisation. 

The colour palette should be beautiful, useful for plotting data and should relate to desired style; in this case, should relate to the Harry Potter world. Some of the colours might change in future versions, in order to find this balance between suitability for plotting and relatable to the Harry Potter universe.


> Most of us need to _listen_ to the music to understand how beautiful it is. But often that’s how statistics are presented: we show the notes instead of playing the music.

![](/posts/harrypotter-hogwarts-houses.png)

![](/posts/harrypotter-show_scales2-1.png)




Installation
-------------

Just copy and execute this bunch of code and you'll have the last version of the package installed:


```r
install.packages("harrypotter")
```

And you can now use it:


```r
library(harrypotter)
```

Usage
-----

The default colour scale of the package is the one of the house *Hufflepuff*. If you prefer to choose another one, you'll need to specify which house you want the palette from.

Let's say that you want a palette made from the house **Gryffindor**.


```r
pal <- hp(25, house = "Gryffindor")
image(volcano, col = pal)
```

![](/posts/harrypotter-unnamed-chunk-3-1.png)

Or a bit more like me, you prefer to be a **Ravenclaw**.


```r
pal <- hp(25, house = "Ravenclaw")
image(volcano, col = pal)
```

![](/posts/harrypotter-unnamed-chunk-4-1.png)

Or put them all together


```r
pal_gryff <- hp(25, house = "Gryffindor")
pal_rav   <- hp(25, house = "Ravenclaw")
pal_huff  <- hp(25, house = "Hufflepuff")
pal_sly   <- hp(25, house = "Slytherin")

par(mfrow = c(2,2))
image(volcano, col = pal_gryff)
image(volcano, col = pal_rav)
image(volcano, col = pal_huff)
image(volcano, col = pal_sly)
```

![](/posts/harrypotter-unnamed-chunk-5-1.png)

### ggplot2

Of course, this package has specific functions to behave seamlessly with the best data visualisation library available. 
The package contains colour scale functions for **ggplot2** plots: `scale_color_hp()` and `scale_fill_hp()`.


Here is a made up example using the colours from the house of **Hufflepuff**,


```r
library(ggplot2)
ggplot(data.frame(x = rnorm(1e4), y = rnorm(1e4)), aes(x = x, y = y)) +
  geom_hex() + 
	coord_fixed() +
  scale_fill_hp(house = "hufflepuff") + 
	theme_bw()
```

![](/posts/harrypotter-unnamed-chunk-6-1.png)

and **Ravenclaw**


```r
library(ggplot2)
ggplot(data.frame(x = rnorm(1e4), y = rnorm(1e4)), aes(x = x, y = y)) +
  geom_hex() + 
	coord_fixed() +
  scale_fill_hp(house = "ravenclaw") + 
	theme_bw()
```

![](/posts/harrypotter-unnamed-chunk-7-1.png)


or more made-up heatmaps

![](/posts/harrypotter-unnamed-chunk-8-1.png)


Using the same function we can also plot these choropleth maps of U.S. unemployment:

![](/posts/harrypotter-ggplot2-1.png)

![](/posts/harrypotter-ggplot2-2.png)



But what if you want discrete scales? These functions also can be used for discrete scales with the argument `discrete = TRUE`. This argument, when TRUE, sets a finite number of sufficiently spaced colours within the selected palette to plot your data.


```r
library("ggplot2")
ggplot(mtcars, aes(factor(cyl), fill=factor(vs))) +  
	geom_bar() +
  scale_fill_hp(discrete = TRUE, house = "Ravenclaw")
```

![](/posts/harrypotter-unnamed-chunk-9-1.png)


```r
ggplot(mpg, aes(class)) +
	geom_bar(aes(fill = drv), position = position_stack(reverse = TRUE)) +
 coord_flip() +
	scale_fill_hp(discrete = TRUE, house = "Gryffindor") +
 theme(legend.position = "top") +
	ylab("") +
	xlab("Class")
```

![](/posts/harrypotter-unnamed-chunk-10-1.png)




```r
x <- y <- seq(-8*pi, 8*pi, len = 40)
r <- sqrt(outer(x^2, y^2, "+"))
filled.contour(cos(r^2)*exp(-r/(2*pi)), 
               axes=FALSE,
               color.palette=hp,
               asp=1)
```

![](/posts/harrypotter-unnamed-chunk-11-1.png)

