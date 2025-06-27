/** @type {import('next').NextConfig} */
const nextConfig = {
  /*  images: {
      domains: [
        "lh3.googleusercontent.com"
      ]
    }, */ // avant c'étais ceci qu'il fallait faire
    
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          port: '',
          pathname: '',
          search: '',
        },
      ],
    }
  } 

export default nextConfig;
