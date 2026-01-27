import SEO from '../components/seo';
import PageHeader from '../components/pageHeader';

export default function Contest() {
    return (
        <>
        <SEO title="피드 경진대회 정보" description="스프 SouF 대학생 피드 경진대회" subTitle="스프" />
        <PageHeader leftText="경진대회" />
            <div className="w-full max-w-[60rem] mx-auto">
                <h1>SOUF 피드 경진대회</h1>
                <div></div>
            </div>
        </>
    )
}