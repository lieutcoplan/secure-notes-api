export async function errorMiddleware(err, req, res, next) {
  
  console.error(err);

  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }

  res.status(500).json({
    error: "Internal server error"
  });
}