class apiResponse {
  ApiResponse = (
    status: string,
    statusCode: number,
    data: any | any[],
    message: string,
  ) => {
    return {
      status,
      statusCode,
      data,
      message,
    };
  };
}

export default apiResponse;
