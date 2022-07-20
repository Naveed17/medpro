SHELL := /bin/bash

MEDPRO_SERVICE_NAME := medpro

DC_CMD = docker-compose -f docker-compose.yml -f docker-compose.dev.yml

.PHONY: dcps dcupd dcstop dclogs dcshell

default: dcps

# Get services URLs and docker-compose process status.
dcps:
	-$(eval MEDPRO_ID := $(shell $(DC_CMD) ps -q $(MEDPRO_SERVICE_NAME)))
	-$(eval MEDPRO_PORT := $(shell docker inspect $(MEDPRO_ID) --format='{{json (index (index .NetworkSettings.Ports "3000/tcp") 0).HostPort}}' 2> /dev/null))
	@echo $(MEDPRO_SERVICE_NAME): $(if $(MEDPRO_PORT), "http://localhost:$(MEDPRO_PORT)", "port not found.")

# New line before the ps.
	@echo
	@$(DC_CMD) ps -a

# Rebuild images, remove orphans, and docker-compose up.
dcupd:
	$(DC_CMD) up -d --build --remove-orphans

# Stop all runner containers.
dcstop:
	$(DC_CMD) stop

# Get core-api container logs.
dclogs:
	$(DC_CMD) logs --tail=100 -f $(MEDPRO_SERVICE_NAME)

# Get a bash inside running core-api container.
dcshell:
	$(DC_CMD) exec $(MEDPRO_SERVICE_NAME) bash

dcdn:
	$(DC_CMD) down  --remove-orphans --volumes

# Include the .d makefiles. The - at the front suppresses the errors of missing
# Include the .d makefiles.
-include makefiles.d
