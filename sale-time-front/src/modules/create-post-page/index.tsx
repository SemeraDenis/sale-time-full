import React from "react";
import Header from "../header";
import Footer from "../footer";
import PostCreateForm from "../../components/post-create-form";

const CreatePostModule: React.FC = () => {
    return(
        <section>
            <Header />
            <PostCreateForm />
            <Footer />
        </section>
    );
}

export default CreatePostModule;