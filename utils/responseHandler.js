export const sendResponse = (
  res, 
  statusCode = 500, 
  status = "INTERNAL_SERVER_ERROR", 
  message = "An unexpected error occurred", 
  data = null
) => {
  return res.status(statusCode).json({
    status,  
    message, 
    data,   
  });
};