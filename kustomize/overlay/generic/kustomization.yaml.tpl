resources:
  - ../../base
nameSuffix: -${ENVIRONMENT}
commonLabels:
  app: med-pro-${ENVIRONMENT}
  name: med-pro-${ENVIRONMENT}
  component: med-pro
patches:
  - deployment-patch.yaml
  - service-patch.yaml
  - ingress.yaml