const Joi = require("joi");

// Order validation schemas
const createOrderSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 100 characters",
  }),

  address: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 10 characters long",
    "string.max": "Address cannot exceed 500 characters",
  }),

  province: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Province is required",
    "string.min": "Province must be at least 2 characters long",
    "string.max": "Province cannot exceed 50 characters",
  }),

  city: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "City is required",
    "string.min": "City must be at least 2 characters long",
    "string.max": "City cannot exceed 50 characters",
  }),

  phoneNumber01: Joi.string()
    .pattern(/^[+]?[\d\s\-\(\)]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Primary phone number is required",
      "string.pattern.base":
        "Primary phone number must be a valid phone number",
    }),

  phoneNumber02: Joi.string()
    .pattern(/^[+]?[\d\s\-\(\)]{10,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base":
        "Secondary phone number must be a valid phone number",
    }),

  productName: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters long",
    "string.max": "Product name cannot exceed 200 characters",
  }),

  trackingId: Joi.string().trim().min(5).max(50).optional().allow("").messages({
    "string.min": "Tracking ID must be at least 5 characters long",
    "string.max": "Tracking ID cannot exceed 50 characters",
  }),

  total: Joi.number().positive().precision(2).required().messages({
    "number.base": "Total must be a valid number",
    "number.positive": "Total must be a positive number",
    "number.precision": "Total can have maximum 2 decimal places",
  }),

  deliverService: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Delivery service is required",
    "string.min": "Delivery service must be at least 2 characters long",
    "string.max": "Delivery service cannot exceed 50 characters",
  }),

  date: Joi.date().iso().required().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format",
  }),

  paymentMethod: Joi.string()
    .valid("COD", "CASH", "ANOTHER")
    .required()
    .messages({
      "string.empty": "Payment method is required",
      "any.only": "Payment method must be one of: COD, CASH, ANOTHER",
    }),
}).unknown(false); // Prevent additional fields like orderNumber, status, createdAt

const updateOrderSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 100 characters",
  }),

  address: Joi.string().trim().min(10).max(500).optional().messages({
    "string.min": "Address must be at least 10 characters long",
    "string.max": "Address cannot exceed 500 characters",
  }),

  province: Joi.string().trim().min(2).max(50).optional().messages({
    "string.min": "Province must be at least 2 characters long",
    "string.max": "Province cannot exceed 50 characters",
  }),

  city: Joi.string().trim().min(2).max(50).optional().messages({
    "string.min": "City must be at least 2 characters long",
    "string.max": "City cannot exceed 50 characters",
  }),

  phoneNumber01: Joi.string()
    .pattern(/^[+]?[\d\s\-\(\)]{10,15}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Primary phone number must be a valid phone number",
    }),

  phoneNumber02: Joi.string()
    .pattern(/^[+]?[\d\s\-\(\)]{10,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base":
        "Secondary phone number must be a valid phone number",
    }),

  productName: Joi.string().trim().min(2).max(200).optional().messages({
    "string.min": "Product name must be at least 2 characters long",
    "string.max": "Product name cannot exceed 200 characters",
  }),

  trackingId: Joi.string().trim().min(5).max(50).optional().allow("").messages({
    "string.min": "Tracking ID must be at least 5 characters long",
    "string.max": "Tracking ID cannot exceed 50 characters",
  }),

  total: Joi.number().positive().precision(2).optional().messages({
    "number.base": "Total must be a valid number",
    "number.positive": "Total must be a positive number",
    "number.precision": "Total can have maximum 2 decimal places",
  }),

  deliverService: Joi.string().trim().min(2).max(50).optional().messages({
    "string.min": "Delivery service must be at least 2 characters long",
    "string.max": "Delivery service cannot exceed 50 characters",
  }),

  date: Joi.date().iso().optional().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format",
  }),

  paymentMethod: Joi.string()
    .valid("COD", "CASH", "ANOTHER")
    .optional()
    .messages({
      "any.only": "Payment method must be one of: COD, CASH, ANOTHER",
    }),

  status: Joi.string()
    .valid("pending", "returned", "delivered")
    .optional()
    .messages({
      "any.only":
        "Status must be one of: pending, returned, delivered",
    }),
});

// Return validation schemas
const createReturnSchema = Joi.object({
  orderId: Joi.string().trim().min(1).required().messages({
    "string.empty": "Order ID is required",
    "string.min": "Order ID must not be empty",
  }),

  dateSent: Joi.date().iso().optional().allow(null).messages({
    "date.base": "Date sent must be a valid date",
    "date.format": "Date sent must be in ISO format",
  }),

  dateReturn: Joi.date().iso().required().messages({
    "date.base": "Date return is required and must be a valid date",
    "date.format": "Date return must be in ISO format",
  }),

  reason: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Return reason is required",
    "string.min": "Return reason must be at least 5 characters long",
    "string.max": "Return reason cannot exceed 500 characters",
  }),

  deliverCharge: Joi.string().trim().optional().allow("").default("0").messages({
    "string.base": "Delivery charge must be a string",
  }),

  productCost: Joi.string().trim().optional().allow("").default("5000").messages({
    "string.base": "Product cost must be a string",
  }),
}).unknown(false);

const updateReturnSchema = Joi.object({
  dateSent: Joi.date().iso().optional().allow(null).messages({
    "date.base": "Date sent must be a valid date",
    "date.format": "Date sent must be in ISO format",
  }),

  dateReturn: Joi.date().iso().optional().messages({
    "date.base": "Date return must be a valid date",
    "date.format": "Date return must be in ISO format",
  }),

  reason: Joi.string().trim().min(5).max(500).optional().messages({
    "string.min": "Return reason must be at least 5 characters long",
    "string.max": "Return reason cannot exceed 500 characters",
  }),

  deliverCharge: Joi.string().trim().optional().allow("").messages({
    "string.base": "Delivery charge must be a string",
  }),

  productCost: Joi.string().trim().optional().allow("").messages({
    "string.base": "Product cost must be a string",
  }),
});

// Validation middleware functions
const validateCreateOrder = (req, res, next) => {
  const { error } = createOrderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateOrder = (req, res, next) => {
  const { error } = updateOrderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateCreateReturn = (req, res, next) => {
  const { error } = createReturnSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateReturn = (req, res, next) => {
  const { error } = updateReturnSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateCreateOrder,
  validateUpdateOrder,
  validateCreateReturn,
  validateUpdateReturn,
};
