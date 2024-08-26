module.exports = {
    apps: [
      {
        name: "banner-management-system",
        script: "npm",
        args: "start",
        // run maximum number of instances
        instances: "max",
        autorestart: true,
        watch: true,
        max_memory_restart: "1G",
        // run in cluster mode
        exec_mode: "cluster",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
};

