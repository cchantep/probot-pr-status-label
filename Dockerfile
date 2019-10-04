FROM node:10

LABEL version="1.0.0"
LABEL maintainer="cchantep"
LABEL com.github.actions.name="Pull request Status label"
LABEL com.github.actions.description="GitHub Action to set status on pull request according labels"
LABEL com.github.actions.icon="git-pull-request"
LABEL com.github.actions.color="blue"

ENV GITHUB_ACTION_NAME="Set pull request status according labels"

ENV PATH=$PATH:/app/node_modules/.bin
WORKDIR /app
COPY . .
RUN npm install --production

ENTRYPOINT ["probot", "receive"]
CMD ["/app/lib/index.js"]
