#!/bin/bash

echo "🚀 Digital Notary Platform - GitHub Setup Helper"
echo "================================================"
echo ""

# Get GitHub username
echo "Enter your GitHub username:"
read github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username is required!"
    exit 1
fi

echo ""
echo "📝 Setting up GitHub repository..."
echo ""

# Update package.json with actual GitHub username
sed -i '' "s/YOUR_USERNAME/$github_username/g" package.json

echo "✅ Updated package.json with your username"

# Show commands to run
echo ""
echo "🔧 Next, run these commands:"
echo ""
echo "1. Add GitHub remote:"
echo "   git remote add origin https://github.com/$github_username/digital-notary-platform.git"
echo ""
echo "2. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Update GitHub username in package.json'"
echo "   git push -u origin main"
echo ""
echo "3. Then go to vercel.com to deploy!"
echo ""
echo "🎉 GitHub repository URL will be:"
echo "   https://github.com/$github_username/digital-notary-platform"
echo ""
echo "🔗 After Vercel deployment, your app will be live at:"
echo "   https://digital-notary-platform.vercel.app"
echo ""
