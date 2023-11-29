apiVersion: apps/v1
kind: Deployment
metadata:
  name: med-pro
spec:
  replicas: 2
  selector:
    matchLabels:
      app: med-pro-${WORKSPACE}
      name: med-pro-${WORKSPACE}
  template:
    metadata:
    spec:
      containers:
        - env:
            - name: PORT
              value: "3000"
          imagePullPolicy: Always
          name: med-pro
      restartPolicy: Always
      terminationGracePeriodSeconds:
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 90
            preference:
              matchExpressions:
              - key: nodepool
                operator: In
                values:
                - ${WORKSPACE}

      tolerations:
      - key: "${WORKSPACE}"
        operator: "Equal"
        value: "${WORKSPACE}"
