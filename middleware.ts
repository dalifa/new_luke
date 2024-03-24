//
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; // les deux !! veut dire un boolean

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    //return null;
    // chatGPT me conseil de mettre return ou return undefined 
    // car j'avais une erreur d'incompatibilité de type en mettant: return null
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    //return null;
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    // redirection vers home après déconnexion
    return Response.redirect(new URL(
      `/home?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  //return null;
  // chatGPT me conseil de mettre return ou return undefined 
  // car j'avais une erreur d'incompatibilité de type en mettant: return null
  return undefined;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    //matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
    // on utilise ici celui de clerk
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
