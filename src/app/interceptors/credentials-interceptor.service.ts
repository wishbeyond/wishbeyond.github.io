import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req.method)
  console.log(req.url)
  console.log(req.body)

  const clonedReq = req.clone({
    withCredentials: true
  });

  return next(clonedReq);
}
