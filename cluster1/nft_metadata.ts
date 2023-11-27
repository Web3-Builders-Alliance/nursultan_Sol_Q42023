import wallet from "./wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr"
import { url } from "inspector";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

         const image = 'https://arweave.net/YlNxadQtdbHe-sbC_wJJXVrlzq6n6moqvDqs_eILM-k'
         const metadata = {
             name: "pretty rug",
             symbol: "myrug",
             description: "firs mint",
             image: image,
             attributes: [
                 {trait_type: 'colour', value: 'babyblue'}
            ],
             properties: {
               files: [
                    {
                         type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        const myUri = await bundlrUploader.uploadJson(metadata)
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();