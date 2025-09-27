# Code Citations

## License: unknown

https://github.com/kevbuh/yummf/tree/ad1ef08ea4ded32366d955bea543d3302be14165/web/pages/api/auth/%5B...nextauth%5D.js

```
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
```

## License: unknown

https://github.com/benorloff/lofty-frontend/tree/50692b98c66784e6c4e5a01fb07051bc4f05d3e2/pages/api/auth/%5B...nextauth%5D.ts

```
";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type:
```

## License: unknown

https://github.com/nahidacm/nextjs-prisma-sqlite-tailwind-typescript-boilerplate/tree/c4d83a69cc759b4f1c52bc888573ee9fbd37385b/pages/api/auth/%5B...nextauth%5D.js

```
,
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const
```

## License: unknown

https://github.com/thenderson55/goldfinch/tree/7085928d86d45ca792f91d10da040527c85ae61a/pages/api/auth/%5B...nextauth%5D.tsx

```
: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        return session;
      }
```

## License: unknown

https://github.com/someuser/someproject/tree/somecommit/pages/api/auth/%5B...nextauth%5D.js

```
import FacebookProvider from "next-auth/providers/facebook";

export default NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
```
