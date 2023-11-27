const validateAddVariants = (req, res, next) => {
  let { variant, attributes } = req.body;

  const dataTypes = {
    variant: "string",
    attributes: "object",
  };
  const isValidDataType = (value, type) => {
    if (type === "string") {
      return typeof value === "string";
    } else if (type === "object") {
      return typeof value === "object";
    }
    return typeof value === type;
  };
  for (const field in dataTypes) {
    if (!isValidDataType(req.body[field], dataTypes[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid DataType for ${field}`,
      });
    }
  }
  req.validatedData = {
    variant,
    attributes,
  };
  next();
};

 const validateEditVariants = (req,res,next)=>{
    const { id, name, attributes } = req.body;
    const dataTypes ={
        id:"number",
        name:"string",
        attributes:"string"
    }
    const isValidDataType =(value,type)=>{
        if(type ==='number'){
            return !isNaN(value);
        }else if(type ==="string"){
            return typeof value ==='string'
        }
        return typeof value ===type;
    };

    for(const field in dataTypes){
        if(!isValidDataType(req.body[field],dataTypes[field])){
            return res.status(400).json({
                success:false,
                message:`Invalid DataType for ${field}`
            });
        }
    }
    req.validatedData ={
        id,
        name,
        attributes,
    }
    next();
  
 }
module.exports = {
  validateAddVariants,
  validateEditVariants,
};
