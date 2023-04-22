import { NextPage } from "next";
import { useRouter } from "next/router"
import PageComponent from "src/components/Page"
import { api } from "src/utils/api"

const Page: NextPage = ({ }) => {

    const router = useRouter();
    const slug = router.query.slug as string;

    const { data, isLoading } = api.page.get.useQuery({ id: slug }, { enabled: !!slug })

    if (isLoading || !data) return <div>Loading...</div>

    return (
        <PageComponent {...data} />
    )
}
export default Page