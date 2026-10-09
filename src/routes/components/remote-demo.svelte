<script lang="ts">
import Snippet from './snippet.svelte';

const snippet = `<pre class="shiki snazzy-light" style="background-color:#f1f5f9;color:#565869" tabindex="0"><code><span class="line"><span style="color:#F767BB">import</span><span style="color:#ADB1C2"> {</span><span style="color:#565869"> AuthenticatedCommander </span><span style="color:#ADB1C2">}</span><span style="color:#F767BB"> from</span><span style="color:#ADB1C2"> '</span><span style="color:#CF9C00">./commanders.ts</span><span style="color:#ADB1C2">'</span><span style="color:#ADB1C2">;</span></span>
<span class="line"><span style="color:#F767BB">import</span><span style="color:#ADB1C2"> {</span><span style="color:#565869"> postSchema </span><span style="color:#ADB1C2">}</span><span style="color:#F767BB"> from</span><span style="color:#ADB1C2"> '</span><span style="color:#CF9C00">./schemas</span><span style="color:#ADB1C2">'</span><span style="color:#ADB1C2">;</span></span>
<span class="line"><span style="color:#F767BB">import</span><span style="color:#565869"> db </span><span style="color:#F767BB">from</span><span style="color:#ADB1C2"> '</span><span style="color:#CF9C00">./db</span><span style="color:#ADB1C2">'</span><span style="color:#ADB1C2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F767BB">export</span><span style="color:#F767BB"> const</span><span style="color:#565869"> makePost </span><span style="color:#ADB1C2">=</span><span style="color:#565869"> AuthenticatedCommander</span><span style="color:#ADB1C2">.</span><span style="color:#09A1ED">form</span><span style="color:#ADB1C2">(</span><span style="color:#565869">postSchema</span><span style="color:#ADB1C2">,</span><span style="color:#F767BB"> async</span><span style="color:#ADB1C2"> ({</span><span style="color:#565869"> ctx</span><span style="color:#ADB1C2">,</span><span style="color:#565869"> data </span><span style="color:#ADB1C2">})</span><span style="color:#ADB1C2"> =></span><span style="color:#ADB1C2"> {</span></span>
<span class="line"><span style="color:#F767BB">	const</span><span style="color:#565869"> post </span><span style="color:#ADB1C2">=</span><span style="color:#ADB1C2"> {</span></span>
<span class="line"><span style="color:#ADB1C2">		...</span><span style="color:#565869">data</span><span style="color:#ADB1C2">,</span></span>
<span class="line"><span style="color:#11658F">		user</span><span style="color:#ADB1C2">:</span><span style="color:#565869"> ctx</span><span style="color:#ADB1C2">.</span><span style="color:#565869">userId</span></span>
<span class="line"><span style="color:#ADB1C2">	};</span></span>
<span class="line"><span style="color:#F767BB">	await</span><span style="color:#565869"> db</span><span style="color:#ADB1C2">.</span><span style="color:#09A1ED">makePost</span><span style="color:#ADB1C2">(</span><span style="color:#565869">post</span><span style="color:#ADB1C2">);</span></span>
<span class="line"><span style="color:#ADB1C2">});</span></span></code></pre>`;
</script>

<Snippet title="posts.remote.ts" {snippet} />
