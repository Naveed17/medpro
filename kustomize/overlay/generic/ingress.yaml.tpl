apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: med-pro
  annotations:
    external-dns.alpha.kubernetes.io/target: ${INGRESS_TARGET}
spec:
  rules:
    - host: ${INGRESS_HOST}
      http:
        paths:
          - backend:
              service:
                name: med-pro
                port:
                  number: 80
            path: /
            pathType: Prefix