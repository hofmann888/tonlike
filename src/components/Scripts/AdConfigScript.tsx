import { getEnvBoolean } from "@/utils/helpers";

export default function AdConfigScript() {
  return (
    <script id="AdConfigScript" dangerouslySetInnerHTML={{
      __html: `
        const richadsPubId = ${process.env.NEXT_PUBLIC_RICHADS_PUB_ID};
        const richadsAppId = ${process.env.NEXT_PUBLIC_RICHADS_APP_ID};
        const richadsDebug = ${getEnvBoolean(process.env.NEXT_PUBLIC_RICHADS_DEBUG)};
      `,
    }} />
  )
}