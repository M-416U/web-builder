import { ElementStructure } from "@/types";

export const landingPage: ElementStructure = {
  id: "landing-page",
  type: "div",
  attributes: {
    class: "container",
    style:
      "font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;",
  },
  children: [
    {
      id: "header",
      type: "header",
      attributes: {
        style:
          "background: #007BFF; color: white; padding: 20px; font-size: 24px;",
      },
      content: "Welcome to My Website",
    },
    {
      id: "hero",
      type: "section",
      attributes: {
        style:
          "margin-top: 20px; padding: 40px; background: #f4f4f4; border-radius: 10px;",
      },
      children: [
        {
          id: "hero-title",
          type: "h1",
          attributes: {
            style: "font-size: 36px; margin-bottom: 10px;",
          },
          content: "Build Something Amazing",
        },
        {
          id: "hero-description",
          type: "p",
          attributes: {
            style: "font-size: 18px; color: #555;",
          },
          content:
            "Create beautiful and interactive web experiences effortlessly.",
        },
        {
          id: "hero-button",
          type: "button",
          attributes: {
            style:
              "margin-top: 10px; padding: 10px 20px; background: #007BFF; color: white; border: none; cursor: pointer; font-size: 16px;",
            onclick: "alert('You clicked Get Started!')",
          },
          content: "Get Started",
        },
      ],
    },
    {
      id: "features",
      type: "section",
      attributes: {
        style: "margin-top: 30px; padding: 20px;",
      },
      children: [
        {
          id: "features-title",
          type: "h2",
          attributes: {
            style: "font-size: 28px; margin-bottom: 15px;",
          },
          content: "Features",
        },
        {
          id: "feature-list",
          type: "ul",
          attributes: {
            style: "list-style: none; padding: 0;",
          },
          children: [
            {
              id: "feature-1",
              type: "li",
              attributes: {
                style: "margin-bottom: 10px; font-size: 18px;",
              },
              content: "✅ Easy to Use",
            },
            {
              id: "feature-2",
              type: "li",
              attributes: {
                style: "margin-bottom: 10px; font-size: 18px;",
              },
              content: "🚀 Fast Performance",
            },
            {
              id: "feature-3",
              type: "li",
              attributes: {
                style: "margin-bottom: 10px; font-size: 18px;",
              },
              content: "🎨 Beautiful UI",
            },
          ],
        },
      ],
    },
    {
      id: "footer",
      type: "footer",
      attributes: {
        style:
          "margin-top: 40px; padding: 10px; background: #333; color: white; font-size: 14px;",
      },
      content: "© 2025 My Website. All Rights Reserved.",
    },
  ],
};

export const loginPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Glow UI</title>
    <style>
        body {
            margin: 0;
            font-family: 'Arial', sans-serif;
            background: #121212;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            background: #1e1e1e;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 300px;
            text-align: center;
        }

        .glow-button {
            background: #6200ea;
            color: #ffffff;
            border: none;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            outline: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(98, 0, 234, 0.5);
        }

        .glow-button:hover {
            background: #3700b3;
            box-shadow: 0 6px 8px rgba(98, 0, 234, 0.7);
        }

        .glow-button:active {
            background: #303f9f;
            box-shadow: 0 2px 4px rgba(98, 0, 234, 0.5);
        }

        .glow-input {
            background: #1e1e1e;
            color: #ffffff;
            border: 2px solid #6200ea;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            margin-bottom: 1rem;
            width: 100%;
            outline: none;
            transition: border-color 0.3s ease;
        }

        .glow-input:focus {
            border-color: #3700b3;
        }

        h1 {
            margin-bottom: 1rem;
            font-size: 2rem;
        }

        p {
            margin-bottom: 1rem;
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>Enter your details below:</p>
        <input type="text" class="glow-input" placeholder="Username" id="username">
        <input type="password" class="glow-input" placeholder="Password" id="password">
        <button class="glow-button" onclick="handleClick()">Login</button>
    </div>

    <script>
        function handleClick() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            alert(\`Username: \${username}\nPassword: \${password}\`);
        }
    </script>
</body>
</html>
`;
