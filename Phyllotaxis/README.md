# Phyllotaxis

Phyllotaxis is the arrangement of leaves in a plant. This sketch simulates how a sunflower would place its seeds, depending on different input parameters.

- **Seed size**, or how big the dot is drawn.
- **Seed spacing**, or how far apart the dots are drawn.
- **Angle** as a percentage of a full 360&deg; turn, i.e. `0.5 = 360 / 2 = 180`.
- **Adjustment**. This is a variable that gets added to `angle` on every iteration like so `theta = (n * angle) + adj`, this provides another variable to fiddle with.

## Observations

If you try an angle that is a rational number, say, `0.5` you will get two lines, or spokes, coming out of the center. If you try `0.33333333` you will get three.

In general, using an angle `1/n` will result in `n` spokes. This is why, the more *irrational* a number is, the less lines, or spokes, will appear in the final result.

The **golden ratio**, being the *most irrational* number, produces an arrangement of seeds without any clear spokes. You can use this value for the angle:

    phi = 0.6180339887

You can also try using the golden ratio in the `adjustment` parameter, this produces another pattern similar to the golden ratio alone, but slightly different in its arrangement.

## Resources

This sketch was inspired by Daniel Shiffman's work [Coding Challenge #30: Phyllotaxis](https://www.youtube.com/watch?v=KWoJgHFYWxY).

You can also see a more detailed explanation of this phenomenon here [The Golden Ratio (why it is so irrational)](https://www.youtube.com/watch?v=sj8Sg8qnjOg) in the Numberphile Youtube channel.