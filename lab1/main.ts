function triangle(val1 = 3, type1 = "leg", val2 = 4, type2 = "leg") {
    const validTypes = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];
    const anglesTypes = ["adjacent angle", "opposite angle", "angle"];

    const isValidType = (type) => validTypes.includes(type);
    const isValidValue = (val) => val > 0 && typeof val === "number";
    const toDegrees = (angle) => angle * (180 / Math.PI);
    const toRadians = (angle) => angle * (Math.PI / 180);
    const isValidTriangle = (a, b, c) => a + b > c && a + c > b && c + b > a;
    const isValidAngle = (angle) => angle < 90;
    const isAngle = (type) => anglesTypes.includes(type);
    const isLeg = (type) => type === "leg";
    const isHypotenuse = (type) => type === "hypotenuse";

    let a, b, c, alpha, beta;

    if (!isValidType(type1) || !isValidType(type2)) {
        console.log(
          "Invalid types"
        );
        return "failed";
    }

    if (!isValidValue(val1) || !isValidValue(val2)) {
        return "Invalid values";
    }    

    if (type1 === "hypotenuse" && type2 === "hypotenuse") {
        console.log(
          "Invalid input - 2 hypotenuses"
        );
        return "failed";
    }

    if (isAngle(type1) && isAngle(type2)) {
        console.log(
          "Invalid input - 2 angles"
        );
        return "failed";
      }

      if (
        (isAngle(type1) && !isValidAngle(val1)) ||
        (isAngle(type2) && !isValidAngle(val2))
      ) {
        return "Invalid input - angle should be < 90";
      }

      if (
        (isHypotenuse(type1) && isLeg(type2) && val1 - val2 <= 0) ||
        (isHypotenuse(type2) && isLeg(type1) && val2 - val1 <= 0)
      ) {
        return "Must be hypotenuse > leg";
      }

    switch (type1) {
        case "leg":
            a = val1;
            switch (type2) {
                case "hypotenuse":
                    c = val2;
                    b = Math.sqrt(c * c - a * a);
                    alpha = toDegrees(Math.asin(a / c));
                    beta = 90 - alpha;
                    break;
                case "leg":
                    b = val2;
                    c = Math.sqrt(a * a + b * b);
                    alpha = toDegrees(Math.asin(a / c));
                    beta = 90 - alpha;
                    break;
                case "adjacent angle":
                    beta = val2;
                    alpha = 90 - beta;
                    c = a / Math.cos(toRadians(beta));
                    b = Math.sqrt(c * c - a * a);
                    break;
                case "opposite angle":
                    alpha = val2;
                    beta = 90 - alpha;
                    c = a / Math.sin(toRadians(alpha));
                    b = Math.sqrt(c * c - a * a);
                    break;
                default:
                    console.log("Minor spelling mistake o_0");
                    return "failed";        
          }
        break;
        case "hypotenuse":
            c = val1;
            switch (type2) {
                case "leg":
                    a = val2;
                    b = Math.sqrt(c * c - a * a);
                    alpha = toDegrees(Math.asin(a / c));
                    beta = 90 - alpha;
                    break;
                case "angle":
                    alpha = val2;
                    beta = 90 - alpha;
                    a = c * Math.sin(toRadians(alpha));
                    b = Math.sqrt(c * c - a * a);
                    break;
                default:
                    console.log("Minor spelling mistake o_0");
                    return "failed";
            } 
        break;
        case "adjacent angle":
            alpha = val1;
            beta = 90 - alpha;
            switch (type2) {
                case "leg":
                    a = val2;
                    c = a / Math.cos(toRadians(alpha));
                    b = Math.sqrt(c * c - a * a);
                    break;
                case "hypotenuse":
                    c = val2;
                    a = c * Math.sin(toRadians(alpha));
                    b = Math.sqrt(c * c - a * a);
                    break;
                default:
                    console.log("Minor spelling mistake o_0");
                    return "failed";    
            }
        break;
        case "opposite angle":
            alpha = val1;
            beta = 90 - alpha;
            switch (type2) {
                case "leg":
                    a = val2;
                    c = a / Math.sin(toRadians(alpha));
                    b = Math.sqrt(c * c - a * a);
                    break;
                case "hypotenuse":
                    c = val2;
                    a = c * Math.cos(toRadians(alpha));
                    b = Math.sqrt(c * c - a * a);
                    break;
                default:
                    console.log("Minor spelling mistake o_0");
                    return "failed";
            }
            break;
        case "angle":
            alpha = val1;
            beta = 90 - alpha;
            c = val2;
            a = c * Math.sin(toRadians(alpha));
            b = Math.sqrt(c * c - a * a);
            break;
        }
        if (!isValidTriangle(a, b, c)) {
            return "Error, any side of triangle should be < than sum of other 2 sides";
        }

        if (!isValidAngle(alpha) || !isValidAngle(beta)) {
            return "The angles of the triangle must be <90";
          }

    console.log(
        "a:", a, "\n",
        "b:", b, "\n",
        "c:", c, "\n",
        "alpha:", alpha, "\n",
        "beta:", beta );
      return "success";
}