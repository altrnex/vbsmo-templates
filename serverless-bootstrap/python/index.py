from typing import Annotated

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from mangum import Mangum
from pydantic import BaseModel, StringConstraints

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


class Greeting(BaseModel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=80)]


@app.get("/v1/health", include_in_schema=False)
@app.get("/v1/health/")
def health():
    return {"status": "ok"}


@app.get("/v1/hello")
def hello():
    return {"message": "Hello!"}


@app.post("/v1/hello")
def greet(greeting: Greeting):
    return {"message": f"Hello, {greeting.name}!"}


@app.exception_handler(RequestValidationError)
def invalid_request(request: Request, error: RequestValidationError):
    return JSONResponse(
        {
            "error": "Please check the submitted details.",
            "issues": [
                {"field": ".".join(str(part) for part in issue["loc"][1:]), "message": issue["msg"]}
                for issue in error.errors()
            ],
        },
        status_code=400,
    )


@app.exception_handler(404)
def not_found(request: Request, error: Exception):
    return JSONResponse({"error": "Not found"}, status_code=404)


handler = Mangum(app, lifespan="off")
